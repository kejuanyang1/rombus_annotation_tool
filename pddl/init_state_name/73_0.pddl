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
    (ontable green pear)
    (ontable small orange carrot)
    (ontable carton of coconut water)
    (ontable can of Pringles chip)
    (ontable yellow basket)
    (clear green pear)
    (clear small orange carrot)
    (clear carton of coconut water)
    (clear can of Pringles chip)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)