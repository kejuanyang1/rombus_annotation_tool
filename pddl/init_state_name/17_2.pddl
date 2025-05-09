(define (problem scene1)
  (:domain manip)
  (:objects
    bunch of green grapes - item
    green pear - item
    carrot - item
    carton of coconut water - item
    black spoon - item
    blue bowl - container
    blue lid - lid
  )
  (:init
    (ontable bunch of green grapes)
    (ontable green pear)
    (ontable carrot)
    (ontable carton of coconut water)
    (ontable black spoon)
    (on blue lid blue bowl)
    (closed blue bowl)
    (handempty)
    (clear bunch of green grapes)
    (clear green pear)
    (clear carrot)
    (clear carton of coconut water)
    (clear black spoon)
    (clear blue lid)
  )
  (:goal (and ))
)