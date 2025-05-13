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
    (ontable carrot)
    (ontable carton of coconut water)
    (ontable black spoon)
    (ontable blue lid)
    (in green pear blue bowl)
    (clear bunch of green grapes)
    (clear carrot)
    (clear carton of coconut water)
    (clear black spoon)
    (clear blue lid)
    (handempty)
  )
  (:goal (and ))
)