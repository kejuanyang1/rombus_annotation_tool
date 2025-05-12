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
    (ontable carton of coconut water)
    (ontable can of Pringles chip)
    (in small orange carrot yellow basket)
    (handempty)
    (clear green pear)
    (clear carton of coconut water)
    (clear can of Pringles chip)
  )
  (:goal (and ))
)