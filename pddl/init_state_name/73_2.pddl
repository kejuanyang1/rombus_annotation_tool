(define (problem scene1)
  (:domain manip)
  (:objects
    green pear - item
    small orange carrot - item
    carton of coconut water - item
    can of Pringles chip - item
    yellow basket - container
  )
  (:init
    (ontable small orange carrot)
    (ontable carton of coconut water)
    (ontable can of Pringles chip)
    (in green pear yellow basket)
    (closed yellow basket)
    (clear small orange carrot)
    (clear carton of coconut water)
    (clear can of Pringles chip)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)